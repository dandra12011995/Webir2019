using System.Web;
using System.Web.Optimization;

namespace Web_Recomendaciones
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js",
                        "~/Scripts/jquery.dataTables.min.js",
                        "~/Scripts/dataTables.bootstrap.min.js",
                        "~/Scripts/dataTables.buttons.min.js",
                        "~/Scripts/datatables.min.js",
                        "~/Scripts/dataTables.responsive.min.js",
                        "~/Scripts/dataTables.select.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at https://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/buttons.dataTables.min.css",
                      "~/Content/dataTables.bootstrap.min.css",
                      "~/Content/datatables.min.css",
                      "~/Content/site.css"));
        }
    }
}
