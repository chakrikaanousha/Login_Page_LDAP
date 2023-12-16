import java.text.AttributedCharacterIterator.Attribute;
import java.util.Properties;
import java.util.jar.Attributes;

import javax.naming.Context;
import javax.naming.NamingEnumeration;
import javax.naming.NamingException;
import javax.naming.directory.DirContext;
import javax.naming.directory.InitialDirContext;
import javax.naming.directory.SearchControls;
import javax.naming.directory.SearchResult;

public class App{
    DirContext connection;

    public void newConnection(){
               Properties env = new Properties();
        env.put(Context.INITIAL_CONTEXT_FACTORY, "com.sun.jndi.ldap.LdapCtxFactory");
        env.put(Context.PROVIDER_URL, "ldap://localhost:10389");
        env.put(Context.SECURITY_PRINCIPAL, "uid=admin, ou = system");
        env.put(Context.SECURITY_CREDENTIALS,"secret");
        try {
            connection = new InitialDirContext(env);
            System.out.println("Connection"+connection);
        } catch (NamingException e) {
            // TODO Auto-generated catch block

            e.printStackTrace();
        }
    }

    public void getAllUsers() throws NamingException{
        String searchFilter = "(ObjectClass=inetOrgPerson)";
        String[] reqAtt = {"cn"};
        SearchControls controls = new SearchControls();
        controls.setSearchScope(SearchControls.SUBTREE_SCOPE);
        controls.setReturningAttributes(reqAtt);

        NamingEnumeration users = connection.search("ou=users, ou=system", searchFilter, controls);

        SearchResult result = null;
        while(users.hasMore()){
            result = (SearchResult) users.next();
            javax.naming.directory.Attributes attr = result.getAttributes();
            System.out.println(attr.get("cn"));
        }

    }
    public static void main(String[] args) throws NamingException{
        App app = new App();
        app.newConnection();
        app.getAllUsers();
 
    }

}