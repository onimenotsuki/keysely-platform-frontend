import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, CreditCard, RefreshCw } from 'lucide-react';
import { useStripeConnect } from '@/hooks/useStripeConnect';

const StripeConnectOnboarding = () => {
  const {
    connectStatus,
    isLoadingStatus,
    startOnboarding,
    isCreatingAccount,
    canReceivePayments,
    refetchStatus,
  } = useStripeConnect();

  if (isLoadingStatus) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Verificando estado de pagos...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = () => {
    if (!connectStatus?.has_account) {
      return <Badge variant="secondary">Sin configurar</Badge>;
    }
    
    if (canReceivePayments) {
      return <Badge variant="default" className="bg-green-600"><CheckCircle className="h-3 w-3 mr-1" />Activado</Badge>;
    }
    
    return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Pendiente</Badge>;
  };

  const getActionButton = () => {
    if (!connectStatus?.has_account) {
      return (
        <Button 
          onClick={startOnboarding} 
          disabled={isCreatingAccount}
          className="w-full"
        >
          {isCreatingAccount ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Creando cuenta...
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4 mr-2" />
              Configurar Pagos con Stripe
            </>
          )}
        </Button>
      );
    }

    if (connectStatus.needs_onboarding) {
      return (
        <Button onClick={startOnboarding} className="w-full">
          <CreditCard className="h-4 w-4 mr-2" />
          Completar Configuración de Stripe
        </Button>
      );
    }

    return (
      <div className="space-y-2">
        <Button onClick={() => refetchStatus()} variant="outline" className="w-full">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar Estado
        </Button>
        {canReceivePayments && (
          <p className="text-sm text-green-600 text-center">
            ✓ Tu cuenta está lista para recibir pagos
          </p>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Configuración de Pagos</span>
          </CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!connectStatus?.has_account ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Para recibir pagos por tus espacios, necesitas configurar una cuenta de Stripe Connect.
              Esto te permitirá recibir transferencias automáticamente cuando los usuarios reserven tus espacios.
            </AlertDescription>
          </Alert>
        ) : connectStatus.needs_onboarding ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Tu cuenta de Stripe está creada pero necesita completar la configuración.
              Haz clic en el botón para continuar el proceso de verificación.
            </AlertDescription>
          </Alert>
        ) : canReceivePayments ? (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              ¡Perfecto! Tu cuenta está configurada y puedes recibir pagos.
              Los fondos se transferirán automáticamente a tu cuenta bancaria.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-700">
              Tu cuenta está en proceso de verificación.
              Esto puede tomar unos minutos. Actualiza el estado para verificar cambios.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <h4 className="font-medium">Información de la cuenta:</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            {connectStatus?.account_id && (
              <p>ID de cuenta: {connectStatus.account_id}</p>
            )}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center space-x-1">
                {connectStatus?.details_submitted ? (
                  <CheckCircle className="h-3 w-3 text-green-600" />
                ) : (
                  <AlertCircle className="h-3 w-3 text-gray-400" />
                )}
                <span>Detalles enviados</span>
              </div>
              <div className="flex items-center space-x-1">
                {connectStatus?.charges_enabled ? (
                  <CheckCircle className="h-3 w-3 text-green-600" />
                ) : (
                  <AlertCircle className="h-3 w-3 text-gray-400" />
                )}
                <span>Pagos habilitados</span>
              </div>
            </div>
          </div>
        </div>

        {getActionButton()}

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• La plataforma cobra una comisión del 15% por cada reserva</p>
          <p>• Los pagos se procesan de forma segura mediante Stripe</p>
          <p>• Recibirás transferencias automáticas a tu cuenta bancaria</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StripeConnectOnboarding;