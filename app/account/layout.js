import SideNavigation from "@/app/_components/SideNavigation";

function Layout({ children }) {
  return (
    <div className="grid lg:grid-cols-[16rem_1fr] lg:h-full gap-12">
      <SideNavigation />

      <div className="py-1">{children}</div>
    </div>
  );
}

export default Layout;
