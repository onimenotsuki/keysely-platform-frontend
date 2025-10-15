import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, CheckCircle, CreditCard, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Footer } from '../components/layout/Footer';
import { Header } from '../components/layout/Header';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const sessionId = searchParams.get('session_id');
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    // Here you could verify the payment with your backend if needed
    if (sessionId) {
      setIsVerified(true);
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon and Message */}
          <div className="mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">¡Pago Exitoso!</h1>
            <p className="text-lg text-muted-foreground">
              Tu reserva ha sido confirmada y el pago procesado correctamente.
            </p>
          </div>

          {/* Payment Details */}
          <Card className="mb-8 text-left">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Detalles del Pago
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {sessionId && (
                <div>
                  <p className="text-sm text-muted-foreground">Session ID</p>
                  <p className="font-mono text-sm">{sessionId}</p>
                </div>
              )}

              <div className="border-t pt-4">
                <div className="flex items-center text-green-600 mb-2">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span className="font-medium">Pago procesado exitosamente</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Recibirás un email de confirmación en breve. El propietario del espacio también ha
                  sido notificado de tu reserva.
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">¿Qué sigue?</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Revisa los detalles de tu reserva en "Mis Reservas"</li>
                  <li>• Contacta al propietario si tienes preguntas</li>
                  <li>• Llega a tiempo el día de tu reserva</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button asChild className="w-full">
                <Link to="/bookings">
                  <Calendar className="w-4 h-4 mr-2" />
                  Ver Mis Reservas
                </Link>
              </Button>

              <Button variant="outline" asChild className="w-full">
                <Link to="/explore">
                  <MapPin className="w-4 h-4 mr-2" />
                  Explorar Más Espacios
                </Link>
              </Button>
            </div>

            <Button variant="ghost" asChild>
              <Link to="/">Volver al Inicio</Link>
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-12 p-6 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">¿Necesitas ayuda?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Si tienes alguna pregunta sobre tu reserva o pago, no dudes en contactarnos.
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

export default PaymentSuccess;
