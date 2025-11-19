package com.backend.backkend.entity;

import org.springframework.data.annotation.Id;
import java.util.ArrayList;
import java.util.List;

public class UserEntity {

    @Id
    private String id;

    private String email;
    private String name;
    private String password;
    private String profileImage;

    private List<String> postIds = new ArrayList<>();

    public UserEntity() {}  // <-- IMPORTANT

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getProfileImage() {
        return profileImage;
    }

    public void setProfileImage(String profileImage) {
        this.profileImage = profileImage;
    }

    public List<String> getPostIds() {
        return postIds;
    }

    public void setPostIds(List<String> postIds) {
        this.postIds = postIds;
    }
}
