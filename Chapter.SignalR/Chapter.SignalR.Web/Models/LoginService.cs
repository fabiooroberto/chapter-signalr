using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;

namespace Chapter.SignalR.Web.Models
{
    public class LoginService : ILoginService
    {
        private List<AccountModel> _accounts;

        public LoginService()
        {
            _accounts = new List<AccountModel>()
            {
                new AccountModel
                {
                    Username = "acc1",
                    Password = "1234",
                    Fullname = "Jose Alberto",
                    Roles = new List<string>
                    {
                        "SuperAdmin"
                    }
                },
                new AccountModel
                {
                    Username = "acc2",
                    Password = "1234",
                    Fullname = "Frederico",
                    Roles = new List<string>
                    {
                        "Admin"
                    }
                }
            };
        }

        public IEnumerable<Claim> GetClaimsAccount(AccountModel account)
        {
            var claims = new List<Claim>();
            claims.Add(new Claim(ClaimTypes.Name, account.Username));
            claims.Add(new Claim("fullName", account.Fullname));
            foreach (var role in account.Roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }
            return claims;
        }

        public AccountModel Login(string username, string password)
        {
            var login = _accounts.SingleOrDefault(l => l.Username == username && l.Password == password);
            if(login != null)
            {
                return login;
            }
            return null;
        }
    }
}
