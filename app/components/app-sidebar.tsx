import { StoreIcon } from 'lucide-react';
import * as React from 'react';
import { Link } from 'react-router';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '~/components/ui/sidebar';
import { useStoreContext } from '~/contexts/store-context';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { stores, selectedStore, onSelectedStore } = useStoreContext();

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg' asChild>
              <Link to={'/'}>
                <span className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
                  <StoreIcon className='size-4' />
                </span>
                <span className='flex flex-col gap-0.5 leading-none'>
                  <span className='font-medium'>Store Locator</span>
                  <span className=''>v1.0.0</span>
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {stores.map((store) => {
              const isSelected =
                store.properties.name === selectedStore?.properties.name;
              return (
                <SidebarMenuItem key={store.properties.name}>
                  <SidebarMenuButton
                    isActive={isSelected}
                    onClick={() => {
                      onSelectedStore(store);
                    }}>
                    {store.properties.name}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
