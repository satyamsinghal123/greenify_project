package com.backend.backkend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.backend.backkend.entity.UserEntity;
import com.backend.backkend.repository.UserRepository;
import com.backend.backkend.utils.JwtUtil;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private JwtUtil jwtUtil;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    // ---------------- REGISTER -------------------
    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody UserEntity user) {

        Map<String, Object> res = new HashMap<>();

        if (userRepo.findByEmail(user.getEmail()) != null) {
            res.put("message", "User already exists");
            return res;
        }

        long count = userRepo.count() + 1;
        String userId = String.format("U%02d", count);
        user.setId(userId);

        user.setPassword(encoder.encode(user.getPassword()));

        if (user.getProfileImage() == null || user.getProfileImage().isEmpty()) {
            user.setProfileImage("https://cdn.pixabay.com/photo/2017/08/06/21/34/people-2596578_1280.jpg");
        }

        userRepo.save(user);

        res.put("message", "Signup successful");
        res.put("token", jwtUtil.generateToken(userId));
        res.put("userId", userId);
        res.put("name", user.getName());
        res.put("profileImage", user.getProfileImage());

        return res;
    }

    // ---------------- LOGIN -------------------
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody UserEntity user) {

        Map<String, Object> res = new HashMap<>();

        UserEntity db = userRepo.findByEmail(user.getEmail());

        if (db == null) {
            res.put("message", "User not found");
            return res;
        }

        if (!encoder.matches(user.getPassword(), db.getPassword())) {
            res.put("message", "Invalid password");
            return res;
        }

        String uid = db.getId();

        res.put("message", "Login successful");
        res.put("token", jwtUtil.generateToken(uid));
        res.put("userId", uid);
        res.put("name", db.getName());
        res.put("profileImage", db.getProfileImage());

        return res;
    }
}
