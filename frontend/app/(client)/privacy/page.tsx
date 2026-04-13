import Link from 'next/link';
import { Shield } from 'lucide-react';
import { Header } from '../../../components/layout/Header';
import { Footer } from '../../../components/layout/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-2xl mb-4">
            <Shield className="w-7 h-7 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Politique de confidentialité</h1>
          <p className="text-gray-500 mt-2">Dernière mise à jour : Janvier 2025</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-8 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Introduction</h2>
            <p>
              Autolink (ci-après "nous", "notre" ou "la Plateforme") s'engage à protéger la vie privée
              de ses utilisateurs. Cette politique de confidentialité explique comment nous collectons,
              utilisons et protégeons vos informations personnelles lorsque vous utilisez notre
              marketplace de pièces détachées automobiles en Mauritanie.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Données collectées</h2>
            <p className="mb-3">Nous collectons les informations suivantes :</p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold mt-0.5">•</span>
                <span><strong>Données d'identité :</strong> prénom, nom, adresse e-mail, numéro de téléphone</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold mt-0.5">•</span>
                <span><strong>Données de boutique :</strong> nom de la boutique, description, localisation, logo</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold mt-0.5">•</span>
                <span><strong>Données de transaction :</strong> historique des commandes, méthodes de paiement utilisées</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold mt-0.5">•</span>
                <span><strong>Données de navigation :</strong> adresse IP, type de navigateur, pages visitées</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold mt-0.5">•</span>
                <span><strong>Communications :</strong> messages échangés via notre système de messagerie</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Utilisation des données</h2>
            <p className="mb-3">Vos données sont utilisées pour :</p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold mt-0.5">•</span>
                <span>Créer et gérer votre compte utilisateur</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold mt-0.5">•</span>
                <span>Faciliter les transactions entre acheteurs et vendeurs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold mt-0.5">•</span>
                <span>Vous envoyer des notifications relatives à vos commandes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold mt-0.5">•</span>
                <span>Améliorer nos services et l'expérience utilisateur</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold mt-0.5">•</span>
                <span>Assurer la sécurité de la plateforme et prévenir les fraudes</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Partage des données</h2>
            <p className="mb-3">
              Nous ne vendons jamais vos données personnelles à des tiers. Vos informations peuvent
              être partagées uniquement dans les cas suivants :
            </p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold mt-0.5">•</span>
                <span>Avec les boutiques partenaires, uniquement pour finaliser vos commandes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold mt-0.5">•</span>
                <span>Avec nos prestataires de services de paiement (Bankily, Masrvi, Sedad)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold mt-0.5">•</span>
                <span>Lorsque la loi mauritanienne l'exige</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Sécurité des données</h2>
            <p>
              Nous mettons en place des mesures de sécurité techniques et organisationnelles pour
              protéger vos données contre tout accès non autorisé, modification, divulgation ou
              destruction. Vos mots de passe sont chiffrés et jamais stockés en clair. Les
              communications sont sécurisées par protocole HTTPS.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Conservation des données</h2>
            <p>
              Vos données sont conservées aussi longtemps que votre compte est actif. Si vous
              supprimez votre compte, vos données personnelles seront effacées dans un délai de
              30 jours, à l'exception des données de transaction qui peuvent être conservées
              pendant 5 ans à des fins légales.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Vos droits</h2>
            <p className="mb-3">Vous disposez des droits suivants concernant vos données :</p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold mt-0.5">•</span>
                <span><strong>Accès :</strong> consulter toutes vos données personnelles</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold mt-0.5">•</span>
                <span><strong>Rectification :</strong> corriger des données incorrectes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold mt-0.5">•</span>
                <span><strong>Suppression :</strong> demander l'effacement de vos données</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold mt-0.5">•</span>
                <span><strong>Opposition :</strong> vous opposer au traitement de vos données</span>
              </li>
            </ul>
            <p className="mt-3">
              Pour exercer ces droits, contactez-nous à :{' '}
              <a href="mailto:privacy@autolink.mr" className="text-blue-600 hover:underline">
                privacy@autolink.mr
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Cookies</h2>
            <p>
              Nous utilisons des cookies essentiels pour le fonctionnement de la plateforme
              (authentification, préférences). Vous pouvez désactiver les cookies dans les
              paramètres de votre navigateur, mais cela peut affecter votre expérience.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Contact</h2>
            <p>
              Pour toute question relative à cette politique de confidentialité, vous pouvez
              nous contacter :
            </p>
            <div className="mt-3 p-4 bg-gray-50 rounded-xl">
              <p><strong>Autolink – SMART MS</strong></p>
              <p className="text-gray-600">Nouakchott, Mauritanie</p>
              <p className="text-gray-600">Email : <a href="mailto:support@autolink.mr" className="text-blue-600 hover:underline">support@autolink.mr</a></p>
            </div>
          </section>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-blue-600 hover:underline text-sm">
            ← Retour à l'accueil
          </Link>
          <span className="mx-3 text-gray-300">|</span>
          <Link href="/terms" className="text-blue-600 hover:underline text-sm">
            Conditions d'utilisation →
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
