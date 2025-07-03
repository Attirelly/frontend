import CardTypeFive from "../cards/CardTypeFive";

interface CardData {
    id: string;
    imageUrl: string;
    discountText?: string;
    title: string;
    description?: string;
    price: number;
    mrp: number;
    discount: number;
}

const cards: CardData[] = [
    { id: '1', imageUrl: '/Homepage/CardImage.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana', price: 5000, mrp: 6000, discount: 15 },
    { id: '2', imageUrl: '/Homepage/CardImage.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana', price: 5000, mrp: 6000, discount: 15 },
    { id: '3', imageUrl: '/Homepage/CardImage.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana', price: 5000, mrp: 6000, discount: 15 },
    { id: '4', imageUrl: '/Homepage/CardImage.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana', price: 5000, mrp: 6000, discount: 15 },
    { id: '5', imageUrl: '/Homepage/CardImage.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana', price: 5000, mrp: 6000, discount: 15 },
];

export default function SectionFiveContainer() {
    return (
        <div className="flex gap-[23px] justify-center">
            {cards.map((card) => (
                <CardTypeFive
                    imageUrl="/HomePage/CardTypeFive.svg"
                    title="Embroidary Kurta"
                    description="The new men's collection, 100% Jaipuri cotton"
                    price={50000}
                    mrp={65000}
                    discount={15} />
            ))}

        </div>
    )
}