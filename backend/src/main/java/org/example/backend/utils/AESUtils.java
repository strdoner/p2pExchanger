package org.example.backend.utils;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.HexFormat;

public class AESUtils {
    private static final String ALGORITHM = "AES/CBC/PKCS5Padding";
    private static final SecureRandom secureRandom = new SecureRandom();

    private static SecretKeySpec getSecretKey() {
        try {
            String hexKey = ENVUtils.getAesKey();

            if (hexKey == null || hexKey.length() != 64) {
                throw new IllegalArgumentException("AES key must be 64-character HEX string (256 bits)");
            }

            byte[] keyBytes = HexFormat.of().parseHex(hexKey);

            return new SecretKeySpec(keyBytes, "AES");
        } catch (Exception e) {
            throw new RuntimeException("Failed to load AES key", e);
        }
    }
    private static byte[] generateIV() {
        byte[] iv = new byte[16];
        secureRandom.nextBytes(iv);
        return iv;
    }

    public static Cipher initCipher(int mode, byte[] keyBytes, byte[] iv) throws Exception {
        SecretKeySpec key = new SecretKeySpec(keyBytes, "AES");
        Cipher cipher = Cipher.getInstance(ALGORITHM);
        cipher.init(mode, key, new IvParameterSpec(iv));
        return cipher;
    }

    public static String encrypt(String data) throws Exception {
        byte[] iv = generateIV();
        Cipher cipher = Cipher.getInstance(ALGORITHM);
        cipher.init(Cipher.ENCRYPT_MODE, getSecretKey(), new IvParameterSpec(iv));

        byte[] encryptedData = cipher.doFinal(data.getBytes(StandardCharsets.UTF_8));
        byte[] combined = new byte[iv.length + encryptedData.length];
        System.arraycopy(iv, 0, combined, 0, iv.length);
        System.arraycopy(encryptedData, 0, combined, iv.length, encryptedData.length);

        return Base64.getEncoder().encodeToString(combined);
    }

    public static String decrypt(String encryptedData) throws Exception {
        byte[] combined = Base64.getDecoder().decode(encryptedData);

        byte[] iv = new byte[16];
        System.arraycopy(combined, 0, iv, 0, iv.length);

        byte[] encrypted = new byte[combined.length - iv.length];
        System.arraycopy(combined, iv.length, encrypted, 0, encrypted.length);

        Cipher cipher = Cipher.getInstance(ALGORITHM);
        cipher.init(Cipher.DECRYPT_MODE, getSecretKey(), new IvParameterSpec(iv));

        return new String(cipher.doFinal(encrypted), StandardCharsets.UTF_8);
    }
}
