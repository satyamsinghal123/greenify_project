package com.backend.backkend.utils;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.util.Base64;

@Component
public class EncryptUtil {

    private static String secret;

    @Value("${app.encrypt.key}")
    public void setSecret(String s){ secret = s; }

    public static String encrypt(String data) {
        try {
            Cipher c = Cipher.getInstance("AES/ECB/PKCS5Padding");
            SecretKeySpec key = new SecretKeySpec(secret.getBytes(), "AES");
            c.init(Cipher.ENCRYPT_MODE, key);
            return Base64.getUrlEncoder().encodeToString(c.doFinal(data.getBytes()));
        } catch (Exception e) { throw new RuntimeException(e); }
    }

    public static String decrypt(String enc) {
        try {
            Cipher c = Cipher.getInstance("AES/ECB/PKCS5Padding");
            SecretKeySpec key = new SecretKeySpec(secret.getBytes(), "AES");
            c.init(Cipher.DECRYPT_MODE, key);
            return new String(c.doFinal(Base64.getUrlDecoder().decode(enc)));
        } catch (Exception e) { throw new RuntimeException(e); }
    }
}
