import { Link, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle, ArrowLeft, CreditCard, RefreshCw } from 'lucide-react';

const PaymentCancelled = () => {
  const [searchParams] = useSearchParams();
  const spaceId = searchParams.get('space_id');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          
          {/* Cancelled Icon and Message */}
          <div className="mb-8">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Pago Cancelado
            </h1>
            <p className="text-lg text-muted-foreground">
              El proceso de pago fue cancelado. Tu reserva no ha sido procesada.
            </p>
          </div>

          {/* Info Card */}
          <Card className="mb-8 text-left">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                ¿Qué pasó?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                El pago fue cancelado antes de completarse. Esto puede suceder por varios motivos:
              </p>
              
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                <li>Decidiste no continuar con el pago</li>
                <li>Cerraste la ventana de pago</li>
                <li>Hubo un problema con el método de pago</li>
                <li>La sesión expiró</li>
              </ul>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h4 className="font-medium text-yellow-900 mb-2">No te preocupes</h4>
                <p className="text-sm text-yellow-700">
                  No se ha procesado ningún cargo. Puedes intentar hacer la reserva nuevamente 
                  cuando estés listo.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {spaceId && (
                <Button asChild className="w-full">
                  <Link to={`/space/${spaceId}`}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Intentar Nuevamente
                  </Link>
                </Button>
              )}
              
              <Button variant="outline" asChild className="w-full">
                <Link to="/explore">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Explorar Espacios
                </Link>
              </Button>
            </div>

            <Button variant="ghost" asChild>
              <Link to="/">
                Volver al Inicio
              </Link>
            </Button>
          </div>

          {/* Help Section */}
          <div className="mt-12 p-6 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">¿Necesitas ayuda?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Si tienes problemas para completar tu reserva o el pago, nuestro equipo está aquí para ayudarte.
            </p>
            <Button variant="outline" size="sm">
              Contactar Soporte
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PaymentCancelled;