SELECT emp.codi_emp AS code,
       emp.nome_emp AS name,
       emp.apel_emp AS nickName,
       emp.tins_emp AS typeCgce,
       COALESCE(TRIM(emp.cgce_emp), '') AS cgce,
       emp.stat_emp AS status,
       emp.dddf_emp AS ddd,
       emp.fone_emp AS fone,
       emp.email_emp AS email,
       emp.ramo_emp AS ramo,
       emp.dtinicio_emp AS dateInicialAsCompanie,
       emp.dcad_emp AS dateInicialAsClient,
       emp.dina_emp AS dateFinalAsClient,
       emp.iest_emp AS inscricaoEstadual,
       emp.imun_emp AS inscricaoMunicipal
       
  FROM bethadba.geempre AS emp

 --WHERE emp.codi_emp  IN (2)

ORDER BY emp.codi_emp