using Microsoft.AspNetCore.SignalR;

namespace Chapter.SignalR.Web.Hubs
{
    public class ChatGrupoHub : Hub
    {
        public Task SendMessageToGroup(string groupName, string message)
        {
            return Clients.Group(groupName).SendAsync("Send", groupName, GetFullName(), message);
        }

        public async Task AddToGroup(string groupName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            await Clients.Group(groupName).SendAsync("Send", groupName, GetFullName(), "entrou no grupo.");
        }

        public async Task RemoveFromGroup(string groupName)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);

            await Clients.Group(groupName).SendAsync("Send", groupName, GetFullName(), "saiu do grupo.");
        }

        public Task SendPrivateMessage(string user, string message)
        {
            return Clients.Client(user).SendAsync("ReceiveMessage", message);
        }

        private string GetFullName()
        {
            return Context.User.Claims.Where(x => x.Type == "fullName").SingleOrDefault().Value;
        }
    }
}
