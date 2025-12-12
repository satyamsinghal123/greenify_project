package com.backend.backkend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.backend.backkend.entity.PostEntity;
import com.backend.backkend.entity.ReportEntity;
import com.backend.backkend.entity.UserEntity;
import com.backend.backkend.repository.PostRepository;
import com.backend.backkend.repository.ReportRepository;
import com.backend.backkend.repository.UserRepository;
import com.backend.backkend.utils.JwtUtil;
import com.backend.backkend.utils.EncryptUtil;

import jakarta.servlet.http.HttpServletRequest;
import java.net.URI;
import java.util.*;
import java.util.stream.Collectors;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class PostController {

    @Autowired
    PostRepository postRepo;

    @Autowired
    UserRepository userRepo;

    @Autowired
    JwtUtil jwtUtil;

    @Autowired
    Cloudinary cloudinary;

    @Autowired
    ReportRepository reportRepo;

    @Autowired
    EncryptUtil encryptUtil;

    private String validate(HttpServletRequest req) {
        String h = req.getHeader("Authorization");
        if (h == null || !h.startsWith("Bearer ")) return null;

        String t = h.substring(7);
        return jwtUtil.validate(t) ? jwtUtil.extractUserId(t) : null;
    }

    @PostMapping("/posts/report")
    public Object reportPost(@RequestBody Map<String, String> body, HttpServletRequest req) {

        String uid = validate(req);
        if (uid == null) return Map.of("error", "Unauthorized");

        String pid = body.get("postId");
        String reason = body.get("reason");

        String postId = encryptUtil.decrypt(pid);

        PostEntity p = postRepo.findById(postId).orElse(null);
        if (p == null) return Map.of("error", "Post not found");

        long count = reportRepo.count() + 1;
        String rid = String.format("R%02d", count);

        ReportEntity r = new ReportEntity();
        r.setId(rid);
        r.setPostId(postId);
        r.setReportedBy(uid);
        r.setOwnerId(p.getUserId());
        r.setReason(reason);

        reportRepo.save(r);

        return Map.of("message", "Report submitted");
    }

    @PostMapping("/posts/create")
    public Object createPost(
            @RequestParam("image") MultipartFile file,
            @RequestParam("text") String text,
            HttpServletRequest req
    ) {
        String uid = validate(req);
        if (uid == null) return Map.of("error","Unauthorized");

        try {
            Map upload = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap("resource_type","auto")
            );

            String url = (String) upload.get("secure_url");

            long count = postRepo.count() + 1;
            String postId = String.format("P%02d", count);

            PostEntity p = new PostEntity();
            p.setId(postId);
            p.setImageUrl(url);
            p.setText(text);
            p.setUserId(uid);
            p.setLikecount(0);

            postRepo.save(p);

            UserEntity u = userRepo.findById(uid).orElse(null);
            if (u != null) {
                u.getPostIds().add(postId);
                userRepo.save(u);
            }

            return Map.of("message","Post created","pid", encryptUtil.encrypt(postId));

        } catch(Exception e) {
            return Map.of("error","Upload failed","detail",e.getMessage());
        }
    }

    @GetMapping("/posts/feed")
    public Object feed(HttpServletRequest req) {
        String uid = validate(req);
        if (uid == null) return Map.of("error","Unauthorized");

        return postRepo.findAll().stream().map(p -> {
            Map<String,Object> m = new HashMap<>();

            m.put("pid", encryptUtil.encrypt(p.getId()));
            m.put("imageKey", encryptUtil.encrypt(p.getImageUrl()));
            m.put("text", p.getText());
            m.put("likecount", p.getLikecount());
            m.put("liked", p.getLikedBy().contains(uid));

            UserEntity u = userRepo.findById(p.getUserId()).orElse(null);
            m.put("userIdKey", encryptUtil.encrypt(p.getUserId()));
            m.put("userName", u != null ? u.getName() : "Unknown");

            return m;

        }).collect(Collectors.toList());
    }

    @GetMapping("/posts/user-secure/{userId}")
    public Object userPosts(@PathVariable String userId, HttpServletRequest req) {

        String uid = validate(req);
        if (uid == null || !uid.equals(userId))
            return Map.of("error","Unauthorized");

        return postRepo.findByUserId(userId).stream().map(p -> {
            Map<String,Object> m = new HashMap<>();
            m.put("pid", encryptUtil.encrypt(p.getId()));
            m.put("imageKey", encryptUtil.encrypt(p.getImageUrl()));
            m.put("text", p.getText());
            m.put("likecount", p.getLikecount());
            m.put("liked", p.getLikedBy().contains(uid));
            return m;
        }).collect(Collectors.toList());
    }

    @PostMapping("/posts/like/{pid}")
    public Object likePost(@PathVariable String pid, HttpServletRequest req) {

        String uid = validate(req);
        if (uid == null) return Map.of("error","Unauthorized");

        String postId = encryptUtil.decrypt(pid);

        PostEntity p = postRepo.findById(postId).orElse(null);
        if (p == null) return Map.of("error","Post not found");

        List<String> liked = p.getLikedBy();
        if (liked.contains(uid)) {
            liked.remove(uid);
            p.setLikecount(p.getLikecount() - 1);
        } else {
            liked.add(uid);
            p.setLikecount(p.getLikecount() + 1);
        }

        postRepo.save(p);

        return Map.of(
                "liked", liked.contains(uid),
                "likecount", p.getLikecount()
        );
    }

    @GetMapping("/posts/image/{key}")
    public Object serveImage(@PathVariable String key) {
        String url = encryptUtil.decrypt(key);
        return org.springframework.http.ResponseEntity
                .status(302)
                .location(URI.create(url))
                .build();
    }
}
