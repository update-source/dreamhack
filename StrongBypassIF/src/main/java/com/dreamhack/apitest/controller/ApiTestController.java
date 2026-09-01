package com.dreamhack.apitest.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.view.RedirectView;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URLDecoder;


import java.util.Arrays;

@Controller
public class ApiTestController {
    @Value("${access-token}")
    private String accessToken;


    public static final String[] ALLOWED_HOSTS = new String[]{
            "127.0.0.1",
            "localhost",
    };

    private boolean containsInvalidCharacters(String str){
        String invalidCharacters = "?/#@";
        for (char c : invalidCharacters.toCharArray()) {
            if(str.indexOf(c) != -1){
                return true;
            }
        }
        return false;
    }

    @GetMapping("/")
    public RedirectView index(Model model) {
        return new RedirectView("/request");
    }

    @GetMapping("/request")
    public String showForm(Model model){
        return "req";
    }

    @PostMapping("/request")
    public String doRequest(@RequestParam(defaultValue = "") String userInfo,
                           @RequestParam String scheme,
                           @RequestParam String host,
                           @RequestParam(defaultValue = "/") String path,
                           Model model) {
        String url = "";

        if (!scheme.equals("http") && !scheme.equals("https")) {
            model.addAttribute("message", "Only http or https.");
            model.addAttribute("url", null);
            return "reqResult";
        }

        if (containsInvalidCharacters(userInfo)) {
            model.addAttribute("message", "The input contains invalid characters.");
            model.addAttribute("url", null);
            return "reqResult";
        }
        userInfo = userInfo.replaceAll("\\s+", "");

        if (containsInvalidCharacters(host)) {
            model.addAttribute("message", "The host contains invalid characters.");
            model.addAttribute("url", null);
            return "reqResult";
        }
        host = host.replaceAll("\\s+", "");
as
        if (!path.startsWith("/")) path = '/' + path;
        path = path.replaceAll("\\s+", "");

        if (!userInfo.isEmpty()) {
            url = scheme + "://" + userInfo + "@" + host + path;
        } else {
            url = scheme + "://" + host + path;
        }

        String parsed_host = UriComponentsBuilder.fromHttpUrl(URLDecoder.decode(url)).build().getHost();
        System.out.println(parsed_host);
        if (Arrays.asList(ALLOWED_HOSTS).contains(parsed_host)) {

            try {
                String[] cmd = {"curl", "-H", "Access-Token: " + accessToken, "-s", url};
                Process p = Runtime.getRuntime().exec(cmd);
                BufferedReader stdInput = new BufferedReader(new InputStreamReader(p.getInputStream()));
                String line;
                StringBuilder sb = new StringBuilder();
                while ((line = stdInput.readLine()) != null) {
                    sb.append(line);
                }
                p.waitFor();
                if (sb.toString().contains("DH{")){
                    model.addAttribute("message", "You can't see the flag");
                    model.addAttribute("url", url);
                    return "reqResult";
                }
                model.addAttribute("message", sb.toString());
                model.addAttribute("url", url);
                return "reqResult";

            } catch (IOException | InterruptedException e) {
                throw new RuntimeException(e);
            }
        }else{
            model.addAttribute("message", "Not allowed to access this URL.");
            model.addAttribute("url", url);
            return "reqResult";
        }

    }
}
