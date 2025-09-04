import React from 'react';
import { TrackingSearch } from '../TrackingWidget';

const TrackingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Suivi de Colis</h1>
          <p className="text-gray-600">
            Suivez vos commandes Lectio en temps réel grâce à notre système de suivi intégré
          </p>
        </div>

        <TrackingSearch />

        {/* Informations supplémentaires */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 font-bold text-xl">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Commande Confirmée</h3>
              <p className="text-sm text-gray-600">
                Votre commande est confirmée et l'étiquette d'expédition est créée
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-xl">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">En Transit</h3>
              <p className="text-sm text-gray-600">
                Votre colis est pris en charge par le transporteur et en cours d'acheminement
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 font-bold text-xl">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Livré</h3>
              <p className="text-sm text-gray-600">
                Votre colis est livré à l'adresse indiquée. Profitez de votre lecture !
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Suivi */}
        <div className="mt-12 bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Questions Fréquentes</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Où trouver mon numéro de suivi ?</h3>
              <p className="text-gray-600 text-sm">
                Votre numéro de suivi vous est envoyé par email dès que votre commande est expédiée. 
                Vous pouvez également le retrouver dans votre espace client, section "Mes commandes".
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Combien de temps prend la livraison ?</h3>
              <p className="text-gray-600 text-sm">
                Les délais de livraison varient selon le transporteur et la destination :
                <br />• France métropolitaine : 2-3 jours ouvrés
                <br />• Europe : 3-7 jours ouvrés
                <br />• International : 7-15 jours ouvrés
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Mon colis n'avance plus, que faire ?</h3>
              <p className="text-gray-600 text-sm">
                Si votre colis semble bloqué, contactez d'abord le transporteur avec votre numéro de suivi. 
                Si le problème persiste, notre équipe support est là pour vous aider.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Je n'ai pas reçu mon colis</h3>
              <p className="text-gray-600 text-sm">
                Vérifiez d'abord auprès de vos voisins ou de votre gardien. Si votre colis est marqué comme livré 
                mais que vous ne l'avez pas reçu, contactez-nous dans les 48h pour ouvrir une enquête.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;

