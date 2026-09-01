package com.dreamhack.apitest.api;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class TestApi {

    @Value("${flag}")
    private String flag;

    @GetMapping("/flag")
    public ResponseEntity<Map<String, String>> getFlag(@RequestHeader(value="Access-Token", required=true) String accessToken){
        Map<String, String> response = new HashMap<>();
        if (accessToken == null || accessToken.isEmpty()){
            response.put("result", "fail");
            response.put("message", "Unauthorized");
            return ResponseEntity.status(403).body(response);
        }
        if (!accessToken.equals("[**REDACTED**]")){
            System.out.println(accessToken);
            response.put("result", "fail");
            response.put("message", "Access token is not Valid");
            return ResponseEntity.status(400).body(response);
        }
        response.put("result", "success");
        response.put("message", flag);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/test")
    public ResponseEntity<Map<String, String>> doHealthCheck(){
        Map<String, String> response = new HashMap<>();
        response.put("result", "success");
        response.put("message", "Good");
        return ResponseEntity.ok(response);
    }
}
