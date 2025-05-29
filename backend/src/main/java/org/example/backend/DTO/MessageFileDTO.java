package org.example.backend.DTO;

import lombok.Data;
import org.example.backend.model.MessageFile;

@Data
public class MessageFileDTO {
    private Long id;
    private String fileName;
    private String fileType;

    public MessageFileDTO(MessageFile file) {
        this.setId(file.getId());
        this.setFileName(file.getFileName());
        this.setFileType(file.getFileType());
    }
}

