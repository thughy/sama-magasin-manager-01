
interface SidebarFooterProps {
  collapsed: boolean;
}

export function SidebarFooter({ collapsed }: SidebarFooterProps) {
  return (
    <div className="p-4 border-t">
      <div className="flex items-center">
        <div className="w-8 h-8 rounded-full bg-sama-100 flex items-center justify-center">
          <span className="text-sm font-medium text-sama-700">SA</span>
        </div>
        {!collapsed && (
          <div className="ml-3">
            <p className="text-sm font-medium">Admin</p>
            <p className="text-xs text-gray-500">admin@samamagasin.com</p>
          </div>
        )}
      </div>
    </div>
  );
}
