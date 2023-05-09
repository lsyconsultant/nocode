package com.nocode.framework.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;

@Controller
public class BaseController {

    @PostMapping("createProject.do")
    public @ResponseBody String createProject(HttpServletRequest req){
        System.out.println("프로젝트 ID : " + req.getParameter("projectId"));
        System.out.println("프로젝트 이름 : " + req.getParameter("projectNm"));
//<<<<<<< HEAD 1234

        return "성공1234";
    }
}
