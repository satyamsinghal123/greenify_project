package com.backend.backkend.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
import java.util.ArrayList;

@Document("conversations")
public class ConversationEntity {
    @Id
    private String id; // e.g. C01
    private List<String> participants = new ArrayList<>(); // userIds
    private String lastMessage;
    private long updatedAt;

    // getters / setters
    public String getId(){return id;}
    public void setId(String id){this.id=id;}
    public List<String> getParticipants(){return participants;}
    public void setParticipants(List<String> p){this.participants = p;}
    public String getLastMessage(){return lastMessage;}
    public void setLastMessage(String m){this.lastMessage = m;}
    public long getUpdatedAt(){return updatedAt;}
    public void setUpdatedAt(long t){this.updatedAt = t;}
}
