using Octokit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using Web_Recomendaciones.ViewModel;
using Web_Recomendaciones.Content;
using static Web_Recomendaciones.ViewModel.Constantes;
using System.Timers;

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

        private const int MAX_SIMILAR_USERS = 10;

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
                User me = (await client.User.Current());

                // Mis repos
                var myRepos = await client.Repository.GetAllForUser(me.Login);
                Dictionary<String, Repository> myReposDict = new Dictionary<string, Repository>();
                foreach (Repository repository in myRepos)
                {
                    if (!myReposDict.ContainsKey(repository.FullName))
                    {
                        myReposDict.Add(repository.FullName, repository);
                    }
                }

                // Mis starred repos
                var starredRepos = (await client.Activity.Starring.GetAllForCurrent());
                foreach (Repository repository in starredRepos)
                {
                    if (!myReposDict.ContainsKey(repository.FullName))
                    {
                        myReposDict.Add(repository.FullName, repository);
                    }
                }

                Dictionary<String, WeightedString> contributors = new Dictionary<string, WeightedString>();
                List<RepositoryContributor> users = new List<RepositoryContributor>();
                foreach (Repository repo in myReposDict.Values)
                {
                    users.Clear();
                    users.AddRange(await client.Repository.GetAllContributors(repo.Owner.Login, repo.Name));
                    foreach (RepositoryContributor c in users)
                    {
                        if (!c.Login.Equals(me.Login))
                        {
                            if (!contributors.ContainsKey(c.Login))
                            {
                                contributors.Add(c.Login, new WeightedString(c.Login, 1));
                            }
                            else
                            {
                                contributors[c.Login].Weight += 1;
                            }

                        }
                    }
                }

                List<WeightedString> sortedContributorsRepos = new List<WeightedString>(contributors.Values);
                sortedContributorsRepos.Sort();

                // Obtengo los repositorios pertenecientes y starred de los usuarios "similares" a mi
                int similarUsers = 1;
                IReadOnlyList<Repository> repos;
                Dictionary<String, WeightedString> repoReco = new Dictionary<string, WeightedString>();
                foreach (WeightedString user in sortedContributorsRepos)
                {
                    repos = await client.Repository.GetAllForUser(user.WString);
                    foreach (Repository repo in repos)
                    {
                        if (!myReposDict.ContainsKey(repo.FullName))
                        {
                            if (!repoReco.ContainsKey(repo.FullName))
                            {
                                repoReco.Add(repo.FullName, new WeightedString(repo.FullName, user.Weight, repo.HtmlUrl));
                            }
                            else
                            {
                                repoReco[repo.FullName].Weight += user.Weight;
                            }
                        }
                    }

                    repos = await client.Activity.Starring.GetAllForUser(user.WString);
                    foreach (Repository repo in repos)
                    {
                        if (!myReposDict.ContainsKey(repo.FullName))
                        {
                            if (!repoReco.ContainsKey(repo.FullName))
                            {
                                repoReco.Add(repo.FullName, new WeightedString(repo.FullName, user.Weight, repo.HtmlUrl));
                            }
                            else
                            {
                                repoReco[repo.FullName].Weight += user.Weight;
                            }
                        }
                    }

                    if (similarUsers > MAX_SIMILAR_USERS)
                        break;
                    similarUsers++;
                }

                List<WeightedString> listaRepoReco = new List<WeightedString>(repoReco.Values);
                listaRepoReco.Sort();

                Session[VARIABLES_SESSION.LINKS] = listaRepoReco;

                //var model = new IndexViewModel(listaRepoReco);
                var model = new IndexViewModel();

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
        public void BuscarRepositorios()
        {
            new Task(() => { GetDatos(); }).Start();
        }
        public async Task<ActionResult> GetDatos()
        {
            try
            {
                User me = (await client.User.Current());

                // Mis repos
                var myRepos = await client.Repository.GetAllForUser(me.Login);
                Dictionary<String, Repository> myReposDict = new Dictionary<string, Repository>();
                foreach (Repository repository in myRepos)
                {
                    if (!myReposDict.ContainsKey(repository.FullName))
                    {
                        myReposDict.Add(repository.FullName, repository);
                    }
                }

                // Mis starred repos
                var starredRepos = (await client.Activity.Starring.GetAllForCurrent());
                foreach (Repository repository in starredRepos)
                {
                    if (!myReposDict.ContainsKey(repository.FullName))
                    {
                        myReposDict.Add(repository.FullName, repository);
                    }
                }

                Dictionary<String, WeightedString> contributors = new Dictionary<string, WeightedString>();
                List<RepositoryContributor> users = new List<RepositoryContributor>();
                foreach (Repository repo in myReposDict.Values)
                {
                    users.Clear();
                    users.AddRange(await client.Repository.GetAllContributors(repo.Owner.Login, repo.Name));
                    foreach (RepositoryContributor c in users)
                    {
                        if (!c.Login.Equals(me.Login))
                        {
                            if (!contributors.ContainsKey(c.Login))
                            {
                                contributors.Add(c.Login, new WeightedString(c.Login, 1));
                            }
                            else
                            {
                                contributors[c.Login].Weight += 1;
                            }

                        }
                    }
                }

                List<WeightedString> sortedContributorsRepos = new List<WeightedString>(contributors.Values);
                sortedContributorsRepos.Sort();

                // Obtengo los repositorios pertenecientes y starred de los usuarios "similares" a mi
                int similarUsers = 1;
                IReadOnlyList<Repository> repos;
                Dictionary<String, WeightedString> repoReco = new Dictionary<string, WeightedString>();
                foreach (WeightedString user in sortedContributorsRepos)
                {
                    repos = await client.Repository.GetAllForUser(user.WString);
                    foreach (Repository repo in repos)
                    {
                        if (!myReposDict.ContainsKey(repo.FullName))
                        {
                            if (!repoReco.ContainsKey(repo.FullName))
                            {
                                repoReco.Add(repo.FullName, new WeightedString(repo.FullName, user.Weight, repo.HtmlUrl));
                            }
                            else
                            {
                                repoReco[repo.FullName].Weight += user.Weight;
                            }
                        }
                    }

                    repos = await client.Activity.Starring.GetAllForUser(user.WString);
                    foreach (Repository repo in repos)
                    {
                        if (!myReposDict.ContainsKey(repo.FullName))
                        {
                            if (!repoReco.ContainsKey(repo.FullName))
                            {
                                repoReco.Add(repo.FullName, new WeightedString(repo.FullName, user.Weight, repo.HtmlUrl));
                            }
                            else
                            {
                                repoReco[repo.FullName].Weight += user.Weight;
                            }
                        }
                    }

                    if (similarUsers > MAX_SIMILAR_USERS)
                        break;
                    similarUsers++;
                }

                List<WeightedString> listaRepoReco = new List<WeightedString>(repoReco.Values);
                listaRepoReco.Sort();

                Session[VARIABLES_SESSION.LINKS] = listaRepoReco;
                return Json(new { });
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

        public ActionResult PublicarLinks(TablaRequestViewModel valor)
        {
            List<TablaRecomendacionesViewModel> registros = new List<TablaRecomendacionesViewModel>();
            List<WeightedString> valores = new List<WeightedString>();
            if (Session[VARIABLES_SESSION.LINKS] != null)
            {
                valores = (List<WeightedString>)Session[VARIABLES_SESSION.LINKS];
                foreach (WeightedString r in valores)
                {
                    TablaRecomendacionesViewModel l = new TablaRecomendacionesViewModel();
                    l.link = r.WString;
                    l.url = r.Url;
                    l.cant = r.Weight.ToString();
                    registros.Add(l);
                }
                registros.Skip(valor.start).Take(valor.length).ToList();
            }
            return Json(new
            {
                draw = valor.draw,
                recordsTotal = registros.Count,
                recordsFiltered = registros.Count,
                data = registros
            }, JsonRequestBehavior.AllowGet);
        }
    }
}