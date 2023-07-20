package com.nocode.framework.bo.dao;

import com.nocode.framework.base.dao.BaseDAO;
import com.nocode.framework.base.dto.ResponseDTO;
import com.nocode.framework.bo.dto.BO;
import com.nocode.framework.bo.dto.BoAttritute;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.servlet.http.HttpServletRequest;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Slf4j
@Repository
public class BoDAO extends BaseDAO {

    @Autowired
    private HttpServletRequest request;

    public ResponseDTO boInsert(BO dto){
        dto.setCreateDatetime(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()));
        dto.setCreateBy(request.getSession().getAttribute("memberId").toString());
        dto.setModifyDatetime(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()));
        dto.setModifyBy(request.getSession().getAttribute("memberId").toString());

        ResponseDTO result = new ResponseDTO();
        try {
            int cnt = insert("bo.insertBo", dto);
            if(cnt > 0){
                result.setResultCd("S");
            }else {
                result.setResultCd("E");
            }
        }catch (Exception e){
            e.printStackTrace();
            result.setResultCd("E");
        }

        return result;
    }

    public ResponseDTO boAttributeInsert(ArrayList<BoAttritute> dto){
        List<BoAttritute> attritutes = new ArrayList<>();
        for(BoAttritute item : dto){
            item.setCreateDatetime(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()));
            item.setCreateBy(request.getSession().getAttribute("memberId").toString());
            item.setModifyDatetime(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()));
            item.setModifyBy(request.getSession().getAttribute("memberId").toString());

            attritutes.add(item);
        }

        ResponseDTO result = new ResponseDTO();
        try {
            int cnt = insert("bo.insertBoAttribute", attritutes);
            if(cnt > 0){
                result.setResultCd("S");
            }else {
                result.setResultCd("E");
            }
        }catch (Exception e){
            e.printStackTrace();
            result.setResultCd("E");
        }

        return result;
    }


}
