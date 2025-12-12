package com.backend.backkend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;

import com.backend.backkend.entity.ConversationEntity;
import com.backend.backkend.entity.MessageEntity;
import com.backend.backkend.entity.UserEntity;

import com.backend.backkend.repository.ConversationRepository;
import com.backend.backkend.repository.MessageRepository;
import com.backend.backkend.repository.UserRepository;

import com.backend.backkend.utils.JwtUtil;
import com.backend.backkend.utils.EncryptUtil;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class ChatController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private ConversationRepository convRepo;

    @Autowired
    private MessageRepository msgRepo;

    @Autowired
    private UserRepository userRepo;

    private String validate(HttpServletRequest req) {
        String h = req.getHeader("Authorization");
        if (h == null || !h.startsWith("Bearer ")) return null;
        String t = h.substring(7);
        return jwtUtil.validate(t) ? jwtUtil.extractUserId(t) : null;
    }

 
    @PostMapping("/chat/conversation")
    public Object getOrCreate(@RequestBody Map<String, String> body, HttpServletRequest req) {

        String me = validate(req);
        if (me == null) return Map.of("error", "Unauthorized");

        String targetKey = body.get("targetUserKey");
        String targetId = EncryptUtil.decrypt(targetKey);

        if (targetId == null) return Map.of("error", "Invalid targetUserKey");
        if (me.equals(targetId)) return Map.of("error", "Cannot chat with yourself");

        // Check if conversation already exists
        List<ConversationEntity> myConvs = convRepo.findByParticipantsContaining(me);
        for (ConversationEntity c : myConvs) {
            if (c.getParticipants().contains(targetId) && c.getParticipants().size() == 2) {
                return Map.of(
                    "conversationId", c.getId(),
                    "conversationKey", EncryptUtil.encrypt(c.getId())
                );
            }
        }

        // Create new conversation
        long count = convRepo.count() + 1;
        String cid = String.format("C%03d", count);

        ConversationEntity nc = new ConversationEntity();
        nc.setId(cid);
        nc.setParticipants(Arrays.asList(me, targetId));
        nc.setLastMessage("");
        nc.setUpdatedAt(System.currentTimeMillis());

        convRepo.save(nc);

        return Map.of(
            "conversationId", cid,
            "conversationKey", EncryptUtil.encrypt(cid)
        );
    }

   
    @GetMapping("/chat/conversations")
    public Object conversations(HttpServletRequest req) {
        String me = validate(req);
        if (me == null) return Map.of("error", "Unauthorized");

        List<ConversationEntity> list = convRepo.findByParticipantsContaining(me);

        return list.stream().map(c -> {
            Map<String, Object> m = new HashMap<>();
            m.put("conversationId", c.getId());
            m.put("conversationKey", EncryptUtil.encrypt(c.getId()));
            m.put("lastMessage", c.getLastMessage());
            m.put("updatedAt", c.getUpdatedAt());

            // Other user = not me
            String other = c.getParticipants().stream()
                .filter(p -> !p.equals(me))
                .findFirst().orElse("");

            UserEntity u = userRepo.findById(other).orElse(null);

            m.put("otherName", u != null ? u.getName() : "Unknown");
            m.put("otherUserKey", u != null ? EncryptUtil.encrypt(other) : "");
            m.put("otherUserId", other);   // REQUIRED FOR WEBSOCKET

            return m;
        }).sorted((a,b) ->
            Long.compare((Long)b.get("updatedAt"), (Long)a.get("updatedAt"))
        ).collect(Collectors.toList());
    }

    
    @GetMapping("/chat/messages/{cid}")
    public Object messages(@PathVariable String cid, HttpServletRequest req) {
        String me = validate(req);
        if (me == null) return Map.of("error", "Unauthorized");

        ConversationEntity c = convRepo.findById(cid).orElse(null);
        if (c == null) return Map.of("error", "Conversation not found");
        if (!c.getParticipants().contains(me)) return Map.of("error", "Not allowed");

        return msgRepo.findByConversationIdOrderByTimestampAsc(cid);
    }
}
