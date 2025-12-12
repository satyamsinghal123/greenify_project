package com.backend.backkend.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document("users")
public class UserEntity {

    @Id
    private String id;
    private String gender;
    private String avatarSeed;

    
    private String email;
    private String name;
    private String password;
    private String profileImage;

    private String bio = "";   // NEW → Optional user bio

    private List<String> postIds = new ArrayList<>();

    // NEW → Followers list (users who follow ME)
    private List<String> followers = new ArrayList<>();

    // NEW → Following list (users I follow)
    private List<String> following = new ArrayList<>();

    public UserEntity() {}

    // ===================== GETTERS & SETTERS =====================

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
    
    public String getAvatarSeed() {
        return avatarSeed;
    }
    public void setAvatarSeed(String avatarSeed) {
        this.avatarSeed = avatarSeed;
    }


    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
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

    // NEW → Followers
    public List<String> getFollowers() {
        return followers;
    }

    public void setFollowers(List<String> followers) {
        this.followers = followers;
    }

    // NEW → Following
    public List<String> getFollowing() {
        return following;
    }

    public void setFollowing(List<String> following) {
        this.following = following;
    }

    // NEW → Bio
    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }
}
