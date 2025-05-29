package org.example.backend.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.Value;
import org.example.backend.model.Message;
import org.example.backend.model.MessageFile;
import org.example.backend.repository.MessageFileRepository;
import org.example.backend.repository.MessageRepository;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;
import java.util.UUID;

@Service
public class FileStorageService {
    private final MessageRepository messageRepository;
    private final MessageFileRepository messageFileRepository;
    private Path fileStorageLocation;

    public FileStorageService(MessageRepository messageRepository, MessageFileRepository messageFileRepository) {
        this.messageRepository = messageRepository;
        this.messageFileRepository = messageFileRepository;
        setFileStorageLocation();
    }
    public void setFileStorageLocation() {
        this.fileStorageLocation = Paths.get("uploads/").toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (IOException ex) {
            throw new RuntimeException("Не удалось создать папку для загрузки файлов", ex);
        }
    }

    public MessageFile storeFile(Long messageId, MultipartFile file) {
        Message message = messageRepository.findById(messageId).orElseThrow(
                () -> new EntityNotFoundException("Сообщение не найдено")
        );
        String fileName = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        String fileExtension = fileName.substring(fileName.lastIndexOf("."));
        String uniqueFileName = UUID.randomUUID() + fileExtension;

        try {
            Path location = this.fileStorageLocation.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), location, StandardCopyOption.REPLACE_EXISTING);

            MessageFile messageFile = new MessageFile();
            messageFile.setFileName(fileName);
            messageFile.setFileType(file.getContentType());
            messageFile.setFilePath(location.toString());
            messageFile.setMessage(message);

            return messageFileRepository.save(messageFile);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public MessageFile getFile(Long fileId) {
        return messageFileRepository.findById(fileId).orElseThrow(
                () -> new EntityNotFoundException("Файл не найден")
        );
    }
}
