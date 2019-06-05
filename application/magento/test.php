<?php

                $pdo = new \PDO(
                        'mysql:host=localhost;dbname=test_db;charset=UTF8', 'root', '1234', array(
                    \PDO::ATTR_PERSISTENT => false,
                    \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION)
                );
                $pdo->exec('set names UTF8');


        for ($i = 1; $i < 5000000; $i++) {
        $stringname1 = '';
        $stringname2 = '';
        $stringname3 = '';

        for ($j = 1; $j < 20; $j++) {
            $stringname1.=chr(rand(97, 122));
            $stringname2.=chr(rand(97, 122));
            $stringname3.=chr(rand(97, 122));
        }


        $stringnamekyr1 = '';
        $stringnamekyr2 = '';
        $stringnamekyr3 = '';

        for ($j = 1; $j < 20; $j++) {
            $stringnamekyr1.=chr(rand(192, 223));
            $stringnamekyr2.=chr(rand(192, 223));
            $stringnamekyr3.=chr(rand(192, 223));
        }




        $intname1 = '';
        $intname2 = '';
        $intname3 = '';
        for ($j = 1; $j < 10; $j++) {
            $intname1.=rand(0, 9);
            $intname2.=rand(0, 9);
            $intname3.=rand(0, 9);
        }


        $longtextname1 = '';
        $longtextname2 = '';
        $longtextname3 = '';
        for ($j = 1; $j < 1000; $j++) {
            $longtextname1.=chr(rand(97, 122));
            $longtextname2.=chr(rand(97, 122));
            $longtextname3.=chr(rand(97, 122));
        }


        $longtextnamekyr1 = '';
        $longtextnamekyr2 = '';
        $longtextnamekyr3 = '';
        for ($j = 1; $j < 1000; $j++) {
            $longtextnamekyr1.=chr(rand(192, 223));
            $longtextnamekyr2.=chr(rand(192, 223));
            $longtextnamekyr3.=chr(rand(192, 223));
        }



        $stringnamekyr1 = mb_strtolower(iconv('cp1251', 'utf-8', $stringnamekyr1), 'UTF-8');
        $stringnamekyr2 = mb_strtolower(iconv('cp1251', 'utf-8', $stringnamekyr2), 'UTF-8');
        $stringnamekyr3 = mb_strtolower(iconv('cp1251', 'utf-8', $stringnamekyr3), 'UTF-8');


        $longtextnamekyr1 = mb_strtolower(iconv('cp1251', 'utf-8', $longtextnamekyr1), 'UTF-8');
        $longtextnamekyr2 = mb_strtolower(iconv('cp1251', 'utf-8', $longtextnamekyr2), 'UTF-8');
        $longtextnamekyr3 = mb_strtolower(iconv('cp1251', 'utf-8', $longtextnamekyr3), 'UTF-8');



        $created = time();

        $sql = "INSERT INTO  bigdata VALUES (NULL,
            '$stringname1',
            '$stringname2',
            '$stringname3',

            '$stringnamekyr1',
            '$stringnamekyr2',
            '$stringnamekyr3',

            '$intname1',
            '$intname2',
            '$intname3',

            '$longtextname1',
            '$longtextname2',
            '$longtextname3',

            '$longtextnamekyr1',
            '$longtextnamekyr2',
            '$longtextnamekyr3',

            '$created'
        )";
        $pdo->query($sql, \PDO::FETCH_ASSOC);
        }