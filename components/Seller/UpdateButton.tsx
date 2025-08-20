'use client';

type UpdateButtonProps = {
  onClick: () => void;
  disabled?: boolean;
};

export default function UpdateButton({ onClick, disabled = false }: UpdateButtonProps) {
  return (
    <div className="mt-6">
      <button
        className={`px-6 py-2 rounded-full 
             bg-white border border-gray-300 
             text-gray-800 font-medium text-sm
             hover:border-gray-400 hover:cursor-pointer
              ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={onClick}
        disabled={disabled}
      >
        Update
      </button>
    </div>
  );
}
