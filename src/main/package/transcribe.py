import os
import sys
import logging
from tempfile import TemporaryDirectory
from faster_whisper import WhisperModel
from subprocess import check_output
from pydub import AudioSegment

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')


def ms_to_str(milliseconds: float, include_ms=False):
    seconds, milliseconds = divmod(milliseconds, 1000)
    minutes, seconds = divmod(seconds, 60)
    hours, minutes = divmod(minutes, 60)
    formatted = f'{int(hours):02d}:{int(minutes):02d}:{int(seconds):02d}'
    if include_ms:
        formatted += f'.{int(milliseconds):03d}'
    return formatted

def convert_webm_to_wav(webm_path, wav_path):
    audio = AudioSegment.from_file(webm_path, format="webm")
    audio.export(wav_path, format="wav")

def transcribe_audio(filename):
    local_model_path = os.path.join(os.path.dirname(__file__), "models", "faster-whisper-small")
    logging.info(f"local path: {local_model_path}")
    if os.path.exists(local_model_path):
        logging.info(f"Using local model at: {local_model_path}")
        model = WhisperModel(local_model_path,
                             device='auto',
                             cpu_threads=int(check_output(["sysctl", "-n", "hw.perflevel0.logicalcpu_max"])),
                             compute_type="auto")
    else:
        logging.info("Local model not found. Downloading from Hugging Face Hub.")
        model = WhisperModel("guillaumekln/faster-whisper-small",
                             device='auto',
                             cpu_threads=int(check_output(["sysctl", "-n", "hw.perflevel0.logicalcpu_max"])),
                             compute_type="auto")

    whisper_lang = "en"
    vad_threshold = 0.5
    
    logging.info("Starting transcription process...")
    segments, info = model.transcribe(
        filename, language=whisper_lang,
        beam_size=1, temperature=0, word_timestamps=True,
        initial_prompt="Hmm, let me think like, hmm, okay, here's what I'm, like, thinking.",
        vad_filter=True,
        vad_parameters=dict(min_silence_duration_ms=200, threshold=vad_threshold))
    
    logging.info("Transcription process completed.")
    return segments, info

if __name__ == "__main__":
    try:
        if len(sys.argv) != 2:
            logging.error("Usage: python script.py <path_to_webm_file>")
            sys.exit(1)

        webm_file = sys.argv[1]
        logging.info(f'Processing webm file: {webm_file}')

        base_filename = os.path.splitext(os.path.basename(webm_file))[0]
        logging.info(f'Base filename: {base_filename}')

        with TemporaryDirectory() as temp_dir:
            wav_file = os.path.join(temp_dir, f"{base_filename}.wav")
            logging.info(f'Temporary WAV file: {wav_file}')

            logging.info('Converting WEBM to WAV')
            convert_webm_to_wav(webm_file, wav_file)

            logging.info('Starting transcription')
            segments, info = transcribe_audio(wav_file)

            save_location = os.path.join(os.getcwd(), "store")
            logging.info(f'Save location: {save_location}')

            os.makedirs(save_location, exist_ok=True)
            output_filepath = os.path.join(save_location, f'{base_filename}.txt')
            logging.info(f'Output filepath: {output_filepath}')

            with open(output_filepath, 'w') as f:
                for segment in segments:
                    text = segment.text
                    f.write(f"{text}\n")

            logging.info(f"Transcription saved to {output_filepath}")

    except Exception as e:
        logging.exception(f"An error occurred: {e}")
        sys.exit(1)