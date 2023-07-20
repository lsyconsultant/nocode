package com.nocode.framework.bo.controller;

import com.nocode.framework.base.dto.ResponseDTO;
import com.nocode.framework.bo.dto.BO;
import com.nocode.framework.bo.service.BoService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;

@Slf4j
@Controller
@RequestMapping("/bo")
public class BoController {

    @Autowired
    BoService boService;

    @PostMapping("/boCreate.do")
    public @ResponseBody ResponseDTO boCreate(@RequestBody BO dto) {
        log.info(dto.toString());
        ResponseDTO result = boService.BoCreate(dto);
        return result;
    }

    @GetMapping("/getBoList.do")
    public @ResponseBody ArrayList<BO> getBoList(HttpServletRequest req){
        return boService.getBoList();
    }

    @GetMapping("getBoDetail.do")
    public @ResponseBody BO getBoDetail(HttpServletRequest req){
        String boId = req.getParameter("bo");
        log.info("boId : {}", boId);
        return boService.getBoDetail(boId);
    }



}
