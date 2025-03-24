import { useState } from "react";
import { motion } from "framer-motion";
import { X, CheckCircle } from "lucide-react";

const InscriptionModal = ({ torneo, onClose, onConfirm }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!aceptaTerminos) return;

    setIsLoading(true);
    await onConfirm();
    setIsLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70'
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 20 }}
        className='bg-slate-800 rounded-lg shadow-xl max-w-md w-full overflow-hidden'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex justify-between items-center p-4 border-b border-slate-700'>
          <h2 className='text-xl font-bold text-white'>
            Inscripción al Torneo
          </h2>
          <button
            onClick={onClose}
            className='text-slate-400 hover:text-white transition-colors cursor-pointer'
          >
            <X className='h-6 w-6' />
          </button>
        </div>

        <div className='p-6'>
          <div className='mb-6'>
            <h3 className='text-lg font-semibold text-white mb-2'>
              {torneo.nombre}
            </h3>
            <p className='text-slate-300 mb-4'>
              Estás a punto de inscribirte en este torneo. Por favor, confirma
              tu participación.
            </p>

            <div className='bg-slate-700/50 rounded-lg p-4 mb-4'>
              <div className='flex justify-between mb-2'>
                <span className='text-slate-300'>Precio de inscripción:</span>
                <span className='text-white font-medium'>
                  {torneo.precio > 0
                    ? `$${torneo.precio.toFixed(2)}`
                    : "Gratuito"}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-slate-300'>Fecha del evento:</span>
                <span className='text-white font-medium'>
                  {new Date(torneo.fecha).toLocaleDateString("es-ES")}
                </span>
              </div>
            </div>

            <div className='flex items-start mb-4'>
              <input
                id='terminos'
                type='checkbox'
                className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-600 rounded bg-slate-700 mt-1'
                checked={aceptaTerminos}
                onChange={(e) => setAceptaTerminos(e.target.checked)}
              />
              <label
                htmlFor='terminos'
                className='ml-2 block text-sm text-slate-300'
              >
                Acepto los términos y condiciones del torneo, y confirmo que
                cumplo con los requisitos para participar.
              </label>
            </div>
          </div>

          <div className='flex justify-end space-x-3'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 cursor-pointer py-2 border border-slate-600 rounded-md text-slate-300 hover:bg-slate-700 transition-colors'
            >
              Cancelar
            </button>
            <button
              type='button'
              onClick={handleSubmit}
              disabled={!aceptaTerminos || isLoading}
              className='px-4 cursor-pointer py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center'
            >
              {isLoading ? (
                <>
                  <svg
                    className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    ></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    ></path>
                  </svg>
                  Procesando...
                </>
              ) : (
                <>
                  <CheckCircle className='h-4 w-4 mr-2' />
                  Confirmar inscripción
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default InscriptionModal;
