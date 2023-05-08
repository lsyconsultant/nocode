package com.nocode.framework.dao;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.DefaultTransactionDefinition;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;

@Repository
public class BaseDAO {

    @Autowired
    @Qualifier(value = "sqlSessionTemplate")
    private SqlSessionTemplate sqlSession;

    @Autowired
    @Qualifier(value = "transactionManager")
    private DataSourceTransactionManager transactionManager;

    private DefaultTransactionDefinition def;
    private TransactionStatus status;

    public int insert(String id, Object param) {
        return sqlSession.insert(id, param);
    }

    public int update(String id, Object param) {
        return sqlSession.update(id, param);
    }

    public int delete(String id, Object param) {
        return sqlSession.delete(id, param);
    }

    public ArrayList queryForList(String id, Object param) {
        ArrayList result = null;

        result = (ArrayList) sqlSession.selectList(id, param);

        return result;
    }

    public Object queryForOne(String id, Object param) {
        Object result = null;

        result = sqlSession.selectOne(id, param);

        return result;
    }

    public Object queryForOne(String id) {
        Object result = null;

        result = sqlSession.selectOne(id);

        return result;
    }

    public void startStransaction() {
        def = new DefaultTransactionDefinition();

        def.setIsolationLevel(TransactionDefinition.ISOLATION_READ_COMMITTED);
        def.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRED);
        status = transactionManager.getTransaction(def);
    }

    public void rollbackTransaction() {
        transactionManager.rollback(status);
    }

    public void commitTransaction() {
        if (!status.isCompleted()) {
            transactionManager.commit(status);
        }
    }

    public Boolean execute(String sql) throws SQLException {
        PreparedStatement preparedStatement = sqlSession.getConnection().prepareStatement(sql);
        return preparedStatement.execute();
    }
    public Object executeQuery(String sql) throws SQLException {
        PreparedStatement preparedStatement = sqlSession.getConnection().prepareStatement(sql);
        return preparedStatement.executeQuery();
    }

}
