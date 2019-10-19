using Octokit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using Web_Recomendaciones.ViewModel;

namespace Web_Recomendaciones.Controllers
{
    public class HomeController : Controller
    {
        // TODO: Replace the following values with the values from your application registration. Register an
        // application at https://github.com/settings/applications/new to get these values.
        const string clientId = "6247094934e496486081";
        private const string clientSecret = "59f1ddfb05ac46f00a72df8839998871ef90bae2";
        readonly GitHubClient client =
            new GitHubClient(new ProductHeaderValue("Haack-GitHub-Oauth-Demo"));

        // This URL uses the GitHub API to get a list of the current user's
        // repositories which include public and private repositories.
        
        // GET: Home
        public async Task<ActionResult> Index()
        {
            var accessToken = Session["OAuthToken"] as string;
            if (accessToken != null)
            {
                // This allows the client to make requests to the GitHub API on the user's behalf
                // without ever having the user's OAuth credentials.
                client.Credentials = new Credentials(accessToken);
            }

            try
            {
                // The following requests retrieves all of the user's repositories and
                // requires that the user be logged in to work.
                var myRepos = await client.Repository.GetAllForCurrent();
                Dictionary<String, Repository> reposDict = new Dictionary<string, Repository>();
                foreach (Repository repository in myRepos)
                {
                    if (!reposDict.ContainsKey(repository.FullName))
                    {
                        reposDict.Add(repository.FullName, repository);
                    }
                }

                var starredRepos = (await client.Activity.Starring.GetAllForCurrent());
                foreach (Repository repository in starredRepos)
                {
                    if (!reposDict.ContainsKey(repository.FullName))
                    {
                        reposDict.Add(repository.FullName, repository);
                    }
                }

                List<Repository> contributorsRepos = new List<Repository>();
                Dictionary<String, int> contributors = new Dictionary<string, int>();
                List<RepositoryContributor> users = new List<RepositoryContributor>();
                foreach (Repository repos in reposDict.Values)
                {
                    users.AddRange(await client.Repository.GetAllContributors(repos.Owner.Login, repos.Name));
                    foreach(RepositoryContributor c in users)
                    {
                        if (!contributors.ContainsKey(c.Login))
                        {
                            contributors.Add(c.Login, 1);
                        }
                        else
                        {
                            contributors[c.Login] += 1;
                        }
                    }
                }



                //var contributors = client.Repository.GetAllContributors("lidonadini", "pruebaProyecto");
                //var a = client.Activity.
                //string rc = contributors.Result.Where(c => c.Login == "lidonadini").FirstOrDefault().ReposUrl;
                /*string rc1 = contributors.Result.Where(c => c.Login == "lidonadini").FirstOrDefault().AvatarUrl;
                int rc2 = contributors.Result.Where(c => c.Login == "lidonadini").FirstOrDefault().Contributions;
                string rc3 = contributors.Result.Where(c => c.Login == "lidonadini").FirstOrDefault().EventsUrl;
                string rc4 = contributors.Result.Where(c => c.Login == "lidonadini").FirstOrDefault().FollowersUrl;
                string rc5 = contributors.Result.Where(c => c.Login == "lidonadini").FirstOrDefault().FollowingUrl;
                string rc6 = contributors.Result.Where(c => c.Login == "lidonadini").FirstOrDefault().GistsUrl;
                string rc7 = contributors.Result.Where(c => c.Login == "lidonadini").FirstOrDefault().HtmlUrl;
                int rc8 = contributors.Result.Where(c => c.Login == "lidonadini").FirstOrDefault().Id;
                string rc9 = contributors.Result.Where(c => c.Login == "lidonadini").FirstOrDefault().NodeId;
                string rc10 = contributors.Result.Where(c => c.Login == "lidonadini").FirstOrDefault().OrganizationsUrl;
                string rc11 = contributors.Result.Where(c => c.Login == "lidonadini").FirstOrDefault().ReceivedEventsUrl;
                bool rc12 = contributors.Result.Where(c => c.Login == "lidonadini").FirstOrDefault().SiteAdmin;
                string rc13 = contributors.Result.Where(c => c.Login == "lidonadini").FirstOrDefault().StarredUrl;
                string rc14 = contributors.Result.Where(c => c.Login == "lidonadini").FirstOrDefault().SubscriptionsUrl;
                string rc15 = contributors.Result.Where(c => c.Login == "lidonadini").FirstOrDefault().Url;*/
                //List<RepositoryContributor> rc = contributors.Result.ToList();
                var model = new IndexViewModel(reposDict.Values);

                return View(model);
            }
            catch (AuthorizationException)
            {
                // Either the accessToken is null or it's invalid. This redirects
                // to the GitHub OAuth login page. That page will redirect back to the
                // Authorize action.
                return Redirect(GetOauthLoginUrl());
            }
        }

        private string GetOauthLoginUrl()
        {
            string csrf = Membership.GeneratePassword(24, 1);
            Session["CSRF:State"] = csrf;

            // 1. Redirect users to request GitHub access
            var request = new OauthLoginRequest(clientId)
            {
                Scopes = { "user", "notifications" },
                State = csrf
            };
            var oauthLoginUrl = client.Oauth.GetGitHubLoginUrl(request);
            return oauthLoginUrl.ToString();
        }

        public async Task<ActionResult> Authorize(string code, string state)
        {
            if (!String.IsNullOrEmpty(code))
            {
                var expectedState = Session["CSRF:State"] as string;
                if (state != expectedState) throw new InvalidOperationException("SECURITY FAIL!");
                Session["CSRF:State"] = null;

                var token = await client.Oauth.CreateAccessToken(
                    new OauthTokenRequest(clientId, clientSecret, code));
                Session["OAuthToken"] = token.AccessToken;
            }

            return RedirectToAction("Index");
        }
    }
}