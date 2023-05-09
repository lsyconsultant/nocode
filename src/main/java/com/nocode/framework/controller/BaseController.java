package com.nocode.framework.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
//파일 관련
import java.io.*;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;

@Controller
public class BaseController {

    @PostMapping("createProject.do")
    public @ResponseBody String createProject(HttpServletRequest req) throws IOException{
        System.out.println("프로젝트 ID : " + req.getParameter("projectId"));
        System.out.println("프로젝트 이름 : " + req.getParameter("projectNm"));
        System.out.println("프로젝트 경로 : " + req.getParameter("project"));
        //ㄴㅇㄹㄴㅇㄹㄴㅇㄹㄴㅇ
        
        String projectId = req.getParameter("projectId");
        
        
        // 기본 폴더 생성 - 위치 지정 필요
        File file = new File("."); 

        String rootPath = file.getAbsolutePath();
        System.out.println("현재 프로젝트의 경로 : "+rootPath );

        // 기본 폴더 생성 - 위치 지정 필요        
        file = new File("./"+projectId+"/main/webapp/WEB-INF"); 

        Files.createDirectories(file.toPath()); 

        // 기본 파일 생성
        String patternText = "$$projectId$$";
        // 1. 원본 File, 복사할 File 준비
        File sourceFile = new File("./source/main/webapp/index.jsp");
        File newFile = new File("./"+projectId+"/main/webapp/index.jsp");
         // 2. 복사
        //Files.copy(sourceFile.toPath(), newFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
        fileCopy_ReplaceText(sourceFile, newFile, patternText, projectId);

        // 1. 원본 File, 복사할 File 준비
        sourceFile = new File("./source/main/webapp/WEB-INF/applicationContext.xml");
        newFile = new File("./"+projectId+"/main/webapp/WEB-INF/applicationContext.xml");
        // 2. 복사
        Files.copy(sourceFile.toPath(), newFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
        
        
        // 1. 원본 File, 복사할 File 준비
        sourceFile = new File("./source/main/webapp/WEB-INF/dispatcher-servlet.xml");
        newFile = new File("./"+projectId+"/main/webapp/WEB-INF/dispatcher-servlet.xml");
         // 2. 복사
        //Files.copy(sourceFile.toPath(), newFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
        fileCopy_ReplaceText(sourceFile, newFile, patternText, projectId);

        // 1. 원본 File, 복사할 File 준비
        sourceFile = new File("./source/main/webapp/WEB-INF/web.xml");
        newFile = new File("./"+projectId+"/main/webapp/WEB-INF/web.xml");
         // 2. 복사
        Files.copy(sourceFile.toPath(), newFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
        

        //복사된 파일 데이터 수정
                
        return "성공";
    }
    
    
    public static void fileCopy_ReplaceText ( File sourceFile , File targetFile , String patternText , String replaceText ) {
    	String result="";
		try {
			BufferedReader br = new BufferedReader(new FileReader(sourceFile));
			BufferedWriter bw = new BufferedWriter(new FileWriter(targetFile));

			while((result = br.readLine()) != null) {
				result = result.replace(patternText, replaceText);
				bw.write(result+ "\r\n");
				bw.flush();
			}
			bw.close();
			br.close();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
    	
    } 
}
