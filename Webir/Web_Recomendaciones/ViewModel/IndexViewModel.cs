using Octokit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Web_Recomendaciones.ViewModel
{
    public class IndexViewModel
    {
        public IndexViewModel(IEnumerable<Repository> repositories)
        {
            Repositories = repositories;
        }

        public IEnumerable<Repository> Repositories { get; private set; }
    }
}