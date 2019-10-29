using Octokit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Web_Recomendaciones.ViewModel
{
    public class IndexViewModel
    {
        public IEnumerable<Repository> Repositories { get; private set; }
    }
}