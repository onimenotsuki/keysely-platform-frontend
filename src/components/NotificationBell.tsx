import { useState, useRef, useEffect } from 'react';
import { Bell, Check, CheckCheck, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  useNotifications, 
  useUnreadNotifications, 
  useMarkNotificationAsRead, 
  useMarkAllNotificationsAsRead,
  useNotificationSubscription,
  Notification
} from '@/hooks/useNotifications';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const NotificationBell = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const { data: notifications = [] } = useNotifications();
  const { data: unreadCount = 0 } = useUnreadNotifications();
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();
  
  // Subscribe to real-time notifications
  useNotificationSubscription();

  if (!user) return null;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'booking':
        return '📅';
      case 'payment':
        return '💳';
      case 'review':
        return '⭐';
      case 'message':
        return '💬';
      case 'system':
        return '🔔';
      default:
        return '📢';
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'booking':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'payment':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'review':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'message':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'system':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      markAsRead.mutate(notification.id);
    }
    // Here you could add navigation logic based on notification type
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate();
  };

  const recentNotifications = notifications.slice(0, 10);
  const hasUnread = unreadCount > 0;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative p-2 hover:bg-accent"
        >
          <Bell className="h-5 w-5" />
          {hasUnread && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-0" align="end">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Notificaciones</CardTitle>
              <div className="flex items-center space-x-2">
                {hasUnread && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMarkAllAsRead}
                    className="text-xs"
                  >
                    <CheckCheck className="h-4 w-4 mr-1" />
                    Marcar todas
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {hasUnread && (
              <p className="text-sm text-muted-foreground">
                Tienes {unreadCount} notificación{unreadCount !== 1 ? 'es' : ''} sin leer
              </p>
            )}
          </CardHeader>

          <Separator />

          <CardContent className="p-0">
            {recentNotifications.length > 0 ? (
              <ScrollArea className="h-80">
                <div className="space-y-1">
                  {recentNotifications.map((notification, index) => (
                    <div key={notification.id}>
                      <button
                        className={`w-full p-3 text-left hover:bg-accent transition-colors ${
                          !notification.is_read ? 'bg-blue-50/50' : ''
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start space-x-3">
                          <span className="text-lg mt-0.5">
                            {getNotificationIcon(notification.type)}
                          </span>
                          
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-start justify-between">
                              <p className="font-medium text-sm truncate pr-2">
                                {notification.title}
                              </p>
                              <div className="flex items-center space-x-1 flex-shrink-0">
                                {!notification.is_read && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                )}
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${getNotificationColor(notification.type)}`}
                                >
                                  {notification.type}
                                </Badge>
                              </div>
                            </div>
                            
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {notification.message}
                            </p>
                            
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(notification.created_at), 'dd MMM, HH:mm', { locale: es })}
                            </p>
                          </div>
                        </div>
                      </button>
                      {index < recentNotifications.length - 1 && (
                        <Separator />
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="p-8 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">
                  No tienes notificaciones aún
                </p>
              </div>
            )}
          </CardContent>

          {recentNotifications.length > 0 && (
            <>
              <Separator />
              <div className="p-3">
                <Button variant="ghost" className="w-full text-sm">
                  Ver todas las notificaciones
                </Button>
              </div>
            </>
          )}
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;