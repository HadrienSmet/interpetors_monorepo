import type { Metadata } from "next";
import { Montserrat, Poiret_One } from "next/font/google";

import { ThemeProvider } from "@/contexts";
import { languages } from "@/i18n/settings";

import "./global.scss";
import "./root.scss";

const montserrat = Montserrat({
    subsets: ["latin"],
    variable: "--font-default",
    weight: "400",
})
const poiretOne = Poiret_One({
    subsets: ["latin"],
	variable: "--font-title",
	weight: "400",
})

export const metadata: Metadata = {
    title: "Leonor's app",
    description: "Helps you to prepare your speechs",
};

export default function RootLayout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: { locale: string }
}>) {
    return (
        <html lang={params.locale}>
            <body className={`${montserrat.variable} ${poiretOne.variable}`}>
                <ThemeProvider>
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}

export function generateStaticParams() {
    return (languages.map((lang) => ({ locale: lang })));
}

// Liste des gens qui vont parler (savoir ce qu'il fait et comment pronnoncer)
// Tous les documents qui sont fournis => Do what???
// Contexte is very important => Why this reunion, why those speakers, why now

// Teamsheets 
// analysing txt
// Names of the peoples, institutions, organizations, ...
// Connaitre les correspondances des choses specifiques a chauqe pays (education)
// Having the translations of technical terms
// Vraimen t maitriser les enjeux

// Programm : Connaitres les intervenants, les enjeux, le contexte, le but, les termes
// Eurodéputés qui vont parler dans les langues que je possède
// Call en plus Connaitre les eruo députés de ma langue principale (connaitre ses clients) 
