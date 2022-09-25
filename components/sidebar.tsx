type Navigation = {
    name: string;
    href: string;
    icon: React.ReactNode;
    current: boolean;
};

type SidebarProps = {
    navigations: Navigation[];
};

export default function Sidebar(props: SidebarProps) {
    const { navigations } = props;

    return <div className="bg-">Sidebar</div>;
}
