'use client';

type UpdateButtonProps = {
  onClick: () => void;
  disabled?: boolean;
};

export default function UpdateButton({ onClick, disabled = false }: UpdateButtonProps) {
  return (
    <div className="mt-6">
      <button
        className={`bg-black text-white text-sm py-2 px-6 rounded-xl transition ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800 cursor-pointer'
        }`}
        onClick={onClick}
        disabled={disabled}
      >
        Update
      </button>
    </div>
  );
}
