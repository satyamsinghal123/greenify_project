package com.backend.backkend.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("messages")
public class MessageEntity {
    @Id
    private String id; // M01...
    private String conversationId;
    private String fromUserId;
    private String toUserId;
    private String text;
    private long timestamp;
    private boolean delivered;
    private boolean seen;

    // getters / setters
    public String getId(){return id;}
    public void setId(String id){this.id=id;}
    public String getConversationId(){return conversationId;}
    public void setConversationId(String c){this.conversationId = c;}
    public String getFromUserId(){return fromUserId;}
    public void setFromUserId(String f){this.fromUserId=f;}
    public String getToUserId(){return toUserId;}
    public void setToUserId(String t){this.toUserId=t;}
    public String getText(){return text;}
    public void setText(String s){this.text=s;}
    public long getTimestamp(){return timestamp;}
    public void setTimestamp(long ts){this.timestamp=ts;}
    public boolean isDelivered(){return delivered;}
    public void setDelivered(boolean d){this.delivered=d;}
    public boolean isSeen(){return seen;}
    public void setSeen(boolean s){this.seen=s;}
}
