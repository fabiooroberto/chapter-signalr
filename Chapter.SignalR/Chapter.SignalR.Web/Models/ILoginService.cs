using System.Security.Claims;

namespace Chapter.SignalR.Web.Models
{
    public interface ILoginService
    {
        public AccountModel Login(string username, string password);
        public IEnumerable<Claim> GetClaimsAccount(AccountModel account);
    }
}
