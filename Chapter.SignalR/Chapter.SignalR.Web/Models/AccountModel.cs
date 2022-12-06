namespace Chapter.SignalR.Web.Models
{
    public class AccountModel
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string Fullname { get; set; }
        public List<string> Roles { get; set; }
    }
}
