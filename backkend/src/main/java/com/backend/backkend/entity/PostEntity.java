package com.backend.backkend.entity;

import org.springframework.data.annotation.Id;
import java.util.ArrayList;
import java.util.List;

public class PostEntity {

    @Id
    private String id;

    private String imageUrl;
    private String text;
    private String userId;
    private Integer likecount = 0;

    private List<String> likedBy = new ArrayList<>();  // NEW FIELD

    public PostEntity() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public Integer getLikecount() { return likecount; }
    public void setLikecount(Integer likecount) { this.likecount = likecount; }

    public List<String> getLikedBy() { return likedBy; }
    public void setLikedBy(List<String> likedBy) { this.likedBy = likedBy; }
}
