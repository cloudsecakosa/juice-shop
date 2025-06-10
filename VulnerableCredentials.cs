using System.Web.Mvc;

namespace ThirdPartyAPI.Controllers
{
    public class VulnerableCredentialsController : Controller
    {
        // Hardcoded Credentials Vulnerability 1: Hardcoded database password
        [HttpGet]
        public ActionResult ConnectToDatabase()
        {
            // Vulnerable: Hardcoding a database password in the connection string
            string connectionString = "Server=myServer;Database=myDb;User Id=admin;Password=SuperSecret123!;";
            return Content($"Connecting to database with connection string: {connectionString}");
        }

        // Hardcoded Credentials Vulnerability 2: Hardcoded API key
        [HttpGet]
        public ActionResult CallExternalApi()
        {
            // Vulnerable: Hardcoding an API key in the code
            string apiKey = "sk_live_abcdef1234567890";
            return Content($"Calling external API with API key: {apiKey}");
        }
    }
}