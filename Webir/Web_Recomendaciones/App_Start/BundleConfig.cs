﻿using System.Web;
using System.Web.Optimization;

namespace Web_Recomendaciones
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.min.js",
                        "~/Content/js/jquery.dataTables.min.js",
                        "~/Content/js/dataTables.bootstrap.min.js",
                        "~/Content/js/dataTables.buttons.min.js",
                        "~/Content/js/datatables.min.js",
                        "~/Content/js/dataTables.responsive.min.js",
                        "~/Content/js/dataTables.select.min.js"));

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
