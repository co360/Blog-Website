use test;

CREATE TABLE blog_posts (
    ID int NOT NULL AUTO_INCREMENT,
    Title VARCHAR(255) NOT NULL,
    Content TEXT NOT NULL,
    PRIMARY KEY(ID)
    );
    
INSERT INTO blog_posts(Title, Content) VALUES ('First Blog Post', 'This is a test post which means the MySQL database has connected properly.');