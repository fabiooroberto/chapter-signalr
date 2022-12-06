using Chapter.SignalR.Web.Models;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Chapter.SignalR.Web.Controllers
{
    public class LoginController : Controller
    {
        private readonly ILoginService _loginService;

        public LoginController(ILoginService loginService)
        {
            _loginService = loginService;
        }

        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult<AccountModel>> Index(string username, string password)
        {
            var response = _loginService.Login(username, password);
            if (response != null)
            {
                ClaimsIdentity claims = new ClaimsIdentity(_loginService.GetClaimsAccount(response), CookieAuthenticationDefaults.AuthenticationScheme);
                ClaimsPrincipal claimsPrincipal = new ClaimsPrincipal(claims);
                HttpContext.Response.Cookies.Append("fullName", response.Fullname);
                await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, claimsPrincipal);
                return RedirectToAction("Index", "Home");
            }
            ViewBag.msg = "Invalid";
            return View("index");
        }
    }
}
