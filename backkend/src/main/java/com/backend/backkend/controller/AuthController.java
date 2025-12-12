package com.backend.backkend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.backend.backkend.entity.UserEntity;
import com.backend.backkend.repository.UserRepository;
import com.backend.backkend.utils.EncryptUtil;
import com.backend.backkend.utils.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private EncryptUtil encryptUtil;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    private String validate(HttpServletRequest req) {
        String h = req.getHeader("Authorization");
        if (h == null || !h.startsWith("Bearer ")) return null;
        String token = h.substring(7);
        return jwtUtil.validate(token) ? jwtUtil.extractUserId(token) : null;
    }


    // =================== REGISTER ===================
    @PostMapping("/register")
    public Object register(@RequestBody UserEntity user) {

        if (userRepo.findByEmail(user.getEmail()) != null) {
            return Map.of("message", "User already exists");
        }

        // Generate User ID
        long count = userRepo.count() + 1;
        String userId = String.format("U%02d", count);
        user.setId(userId);

        // Hash password
        user.setPassword(encoder.encode(user.getPassword()));

        // Prepare username for avatar
        String cleanName = user.getName().replaceAll("\\s+", "");

        // Generate avatar once
        String avatarUrl;

        if ("girl".equalsIgnoreCase(user.getGender())) {
            avatarUrl = "https://avatar.iran.liara.run/public/girl?username=" + cleanName;
        } else {
            avatarUrl = "https://avatar.iran.liara.run/public/boy?username=" + cleanName;
        }

        user.setProfileImage(avatarUrl);

        // Default fields
        if (user.getFollowers() == null) user.setFollowers(new ArrayList<>());
        if (user.getFollowing() == null) user.setFollowing(new ArrayList<>());
        if (user.getPostIds() == null) user.setPostIds(new ArrayList<>());
        if (user.getBio() == null) user.setBio("");

        // Save user in DB
        userRepo.save(user);

        return Map.of(
                "message", "Signup successful",
                "token", jwtUtil.generateToken(userId),
                "userId", userId,
                "name", user.getName(),
                "profileImage", user.getProfileImage()
        );
    }






    // =================== LOGIN ===================
    @PostMapping("/login")
    public Object login(@RequestBody UserEntity user) {

        UserEntity db = userRepo.findByEmail(user.getEmail());
        if (db == null) return Map.of("message", "User not found");

        if (!encoder.matches(user.getPassword(), db.getPassword()))
            return Map.of("message", "Invalid password");

        return Map.of(
                "message", "Login successful",
                "token", jwtUtil.generateToken(db.getId()),
                "userId", db.getId(),
                "name", db.getName(),
                "profileImage", db.getProfileImage()
        );
    }

    
    

    // =================== USER PROFILE ===================
    @GetMapping("/users/{userKey}")
    public Object getUserProfile(@PathVariable String userKey, HttpServletRequest req) {

        String myId = validate(req);
        if (myId == null) return Map.of("error", "Unauthorized");

        String userId = encryptUtil.decrypt(userKey);
        if (userId == null) return Map.of("error", "Invalid user key");

        UserEntity u = userRepo.findById(userId).orElse(null);
        if (u == null) return Map.of("error", "User not found");

        boolean followed = u.getFollowers().contains(myId);

        return Map.of(
                "userId", u.getId(),
                "userIdKey", encryptUtil.encrypt(u.getId()),
                "name", u.getName(),
                "profileImage", u.getProfileImage(),
                "bio", u.getBio(),
                "followers", u.getFollowers().size(),
                "following", u.getFollowing().size(),
                "followed", followed
        );
    }


    // =================== FOLLOW / UNFOLLOW ===================
    @PostMapping("/users/{userKey}/follow")
    public Object followOrUnfollow(@PathVariable String userKey, HttpServletRequest req) {

        String me = validate(req);
        if (me == null) return Map.of("error", "Unauthorized");

        String targetId = encryptUtil.decrypt(userKey);
        if (targetId == null) return Map.of("error", "Invalid user");

        if (me.equals(targetId)) return Map.of("error", "Cannot follow yourself");

        UserEntity meUser = userRepo.findById(me).orElse(null);
        UserEntity target = userRepo.findById(targetId).orElse(null);

        if (meUser == null || target == null)
            return Map.of("error", "User not found");

        boolean already = target.getFollowers().contains(me);

        if (already) {
            target.getFollowers().remove(me);
            meUser.getFollowing().remove(targetId);
        } else {
            target.getFollowers().add(me);
            meUser.getFollowing().add(targetId);
        }

        userRepo.save(target);
        userRepo.save(meUser);

        return Map.of(
                "followed", !already,
                "followers", target.getFollowers().size()
        );
    }
    
    @GetMapping("/decrypt/{encrypted}")
    public Object decryptUser(@PathVariable String encrypted) {
        try {
            return Map.of("id", EncryptUtil.decrypt(encrypted));
        } catch (Exception e) {
            return Map.of("error", "Invalid encrypted value");
        }
    }

}
