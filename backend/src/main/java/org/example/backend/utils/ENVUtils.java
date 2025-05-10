package org.example.backend.utils;
import io.github.cdimascio.dotenv.Dotenv;
public class ENVUtils {
    private static final Dotenv dotenv = Dotenv.configure().directory(System.getProperty("user.dir")).load();

    public static String getAesKey() {
        return dotenv.get("AES_KEY");
    }
}
